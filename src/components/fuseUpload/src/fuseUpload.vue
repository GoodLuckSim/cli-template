<template>
  <div>
    <el-upload
      ref="upload"
      class="upload-demo"
      name="file"
      :list-type="listType"
      :action="''"
      :data="params"
      :accept="accept"
      :multiple="false"
      :on-remove="handleRemove"
      :http-request="uploadFile"
      :on-success="onUploadFilesSuccess"
      :on-preview="handlePreview"
      :limit="limit"
      :on-exceed="onExceed"
      :before-upload="beforeLoad"
      :file-list="formatFileList(value)"
    >
      <slot />
      <div slot="tip" class="el-upload__tip">{{ tip }}</div>
    </el-upload>
    <el-image-viewer
      v-if="imgViewerVisible"
      :on-close="handleImgViewerClose"
      :url-list="imgViewerLists"
    />
  </div>
</template>

<script>
import axios from 'axios'
// import { Message } from 'element-ui'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  name: 'fuseUpload',
  components: {
    ElImageViewer
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    uploadUrl: {
      type: [Function],
      default: (res) => {
        return {
          res: ''
        }
      }
    },
    fileUrl: {
      type: [Function],
      default: (res) => {
        return {
          res: ''
        }
      }
    },
    accept: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 20
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fileParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    listType: {
      type: String,
      default: ''
    },
    maxFileSize: {
      type: Number,
      default: 10
    },
    tip: {
      type: String,
      default: ''
    }
    // fileList: {
    //   type: Array,
    //   default: () => {
    //     return []
    //   }
    // }
  },
  data: function () {
    return {
      // uploadFiles: uploadFiles(),
      isConfirmLoading: false,
      urlList: '',
      currentUploadUrl: '',
      currentUpload: '',
      currentFileInfo: {},
      drawer: false,
      filesData: {
        affixId: '',
        fileCategory: ''
      },
      imgViewerLists: [],
      imgViewerVisible: false,
      headers: {}
    }
  },
  computed: {
  },
  watch: {

  },
  created() {

  },
  mounted() {
  },
  methods: {
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        reader.readAsArrayBuffer(file)
        reader.onload = function () {
          imgResult = reader.result
        }
        reader.onerror = function (error) {
          reject(error)
        }
        reader.onloadend = function () {
          resolve(imgResult)
        }
      })
    },

    getFileUrl(key) {
      let url = ''
      const params = {
        'fileKeys': [key],
        'zoom': ''
      }
      this.fileUrl(params).then(res => {
        url = res[0].fileUrl
      })
      return url
    },

    formatParams(fileList) {
      const list = [...fileList]
      const arr = []
      for (let i = 0; i < list.length; i++) {
        if (Object.keys(this.fileParams).length == 0) {
          arr.push({
            fileName: list[i].name || list[i].fileName,
            fileType: list[i].fileType,
            fileKey: list[i].fileKey
          })
        } else {
          const json = {}
          Object.keys(this.fileParams).map(v => {
            json[v] = list[i][this.fileParams[v]] || ''
          })
          arr.push(json)
        }
      }
      return arr
    },
    formatFileList(list) {
      const arr = []
      for (let i = 0; i < list.length; i++) {
        arr.push(
          Object.assign(list[i],
            {
              name: list[i].name || list[i].fileName,
              url: list[i].url || list[i].fileUrl
            }
          )
        )
      }
      return arr
    },
    onExceed(files, fileList) {

    },
    // 删除文件
    handleRemove(file, fileList) {
      let inx
      this.value.map((item, index) => {
        if (item.fileKey == file.fileKey) {
          inx = index
        }
      })
      this.value.splice(inx, 1)
      this.$emit('input', this.formatParams(this.value))
    },

    // 上传之前
    beforeLoad(file) {
      // console.log(file)
      // this.currentUploadName = e.name
      if (!this.determineFileSize(file)) return false
      // this.getUploadUrl(file)
      // return false
    },

    put(url, data, headers) {
      return new Promise((resolve, reject) => {
        axios.put(url, data, { headers: headers }).then(response => (
          resolve(response)
        )).catch(err => {
          reject(err.data)
        })
      })
    },

    async uploadFile(file) {
      const params = {
        'fileNames': [file.file.name]
      }
      const res = await this.uploadUrl(params)
      if (res) {
        this.currentFileInfo = res[0]
        this.currentUploadUrl = res[0].uploadUrl
        this.headers = res[0].headers
        this.getBase64(file.file).then(data => {
          this.put(res[0].uploadUrl, data, res[0].headers).then(response => {
            delete this.currentFileInfo.headers
            this.value.push(Object.assign(this.currentFileInfo, { name: this.currentFileInfo.fileName }))
            this.$emit('input', this.formatParams(this.value))
          })
        })
      } else {
        return false
      }
    },
    determineFileSize(file) {
      const size = file.size
      const fileSize = size / 1024 / 1024
      const isConformSize = fileSize <= this.maxFileSize
      if (!isConformSize) {
        this.$message({
          message: 'Cannot upload file size exceeding "' + this.maxFileSize + 'M"',
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 获取上传路径
    async getUploadUrl(file) {

    },

    // 上传成功之后
    onUploadFilesSuccess(e) {
      // if (!e.data || !e.data.fileKey) return
      // this.value.push(Object.assign(e.data, { name: e.data.fileName }))
      // this.$emit('input', this.formatParams(this.value))
    },

    // 获取文件后缀
    getFileType(name) {
      const index = name.lastIndexOf('.')
      const ext = name.substr(index + 1)
      return ext
    },
    // 判断文件类型
    fileType(url) {
      let type = null
      if (!url) {
        return type
      }
      const photoType = ['png', 'jpg', 'jpeg', 'svg', 'PNG', 'JPG', 'JPEG', 'gif', 'GIF']
      const index = url.lastIndexOf('.')
      const ext = url.substr(index + 1)

      type = photoType.indexOf(ext) > -1 ? 'photo' : ext;
      return type
    },
    // 点击element upload组件预览
    async handlePreview(field) {
      const params = {
        'fileKeys': [field.fileKey],
        'zoom': ''
      }
      this.fileUrl(params).then(res => {
        this.imgViewerLists = []
        this.value.forEach(file => {
          const fileUrl = res[0].fileUrl || file.url || file.fileUrl
          if (file.name == field.name) {
            if (['png', 'jpg', 'jpeg', 'svg', 'PNG', 'JPG', 'JPEG', 'gif', 'GIF'].indexOf(file.fileType) > -1) {
              this.imgViewerLists.push(fileUrl)
              this.imgViewerVisible = true
              this.dialogUploadVisible = false
            } else if (['pdf', 'PDF'].indexOf(file.fileType) > -1) {
              window.open(fileUrl)
            } else {
              window.open((['doc', 'docx', 'xls', 'xlsx'].indexOf(file.fileType) > -1 ? 'http://view.officeapps.live.com/op/view.aspx?src=' : '') + fileUrl)
            }
          }
        })
      })
    },
    // 关闭预览弹窗
    handleImgViewerClose() {
      document.getElementsByTagName('body')[0].style.overflow = ''
      this.imgViewerVisible = false
      this.dialogUploadVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
